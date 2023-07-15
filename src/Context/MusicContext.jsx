import React, { useContext, useEffect, useReducer, useState } from "react";
import reducer from "../Reducers/MusicReducer";
import {
  GET_HOME_DATA_BEGIN,
  GET_HOME_DATA_SUCESS,
  GET_HOMEDATA_ERROR,
  GET_SINGLE_ALBUM_BEGIN,
  GET_SINGLE_ALBUM_SUCESS,
  GET_SINGLE_ALBUM_ERROR,
  ALERT_SHOW,
  GET_SINGLE_PLAYLIST_BEGIN,
  GET_SINGLE_PLAYLIST_SUCESS,
  GET_SINGLE_PLAYLIST_ERROR,
  GET_ARTIST_DETAILS_BEGIN,
  GET_ARTIST_DETAILS_SUCESS,
  GET_ARTIST_DETAILS_ERROR,
  GET_ARTIST_SONGS_BEGIN,
  GET_ARTIST_SONGS_SUCESS,
  GET_ARTIST_SONGS_ERROR,
  GET_ARTIST_ALBUMS_BEGIN,
  GET_ARTIST_ALBUMS_SUCESS,
  GET_ARTIST_ALBUMS_ERROR,
} from "../Actions";
import { useHomeReducer } from "../Reducers";
import { SaavanService } from "../services";

const initialState = {
  homeData_loading: false,
  single_album_loading: false,
  single_artist_loading: false,
  single_artist_songs_loading: false,
  single_artist_albums_loading: false,
  albums: [],
  playlists: [],
  charts: [],
  trendingAlbums: [],
  trendingSongs: [],
  currentAlbum: [],
  currentPlaylists: [],
  alert_show: false,
  single_artist_details: [],
  single_artist_songs: [],
  single_artist_albums: [],
};

const MusicContext = React.createContext();

export const MusicProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const homeState = useHomeReducer();

  const singleAlbums = async (id) => {
    dispatch({ type: GET_SINGLE_ALBUM_BEGIN });
    try {
      const response = await SaavanService.getAlbums(id);
      const result = response.data.data;

      dispatch({ type: GET_SINGLE_ALBUM_SUCESS, payload: result });
    } catch (error) {
      dispatch({ type: GET_SINGLE_ALBUM_ERROR });
    }
  };

  const SinglePlaylist = async (id) => {
    dispatch({ type: GET_SINGLE_PLAYLIST_BEGIN });
    try {
      const response = await SaavanService.getPlaylists(id);
      const result = response.data.data;
      dispatch({ type: GET_SINGLE_PLAYLIST_SUCESS, payload: result });
    } catch (error) {
      dispatch({ type: GET_SINGLE_PLAYLIST_ERROR });
    }
  };

  const SingleArtist = async (id) => {
    dispatch({ type: GET_ARTIST_DETAILS_BEGIN });
    try {
      const response = await SaavanService.getArtists(id);
      const result = response.data.data;
      dispatch({ type: GET_ARTIST_DETAILS_SUCESS, payload: result });
    } catch (error) {
      dispatch({ type: GET_ARTIST_DETAILS_ERROR });
    }
  };

  const ArtistSongs = async (id) => {
    dispatch({ type: GET_ARTIST_SONGS_BEGIN });
    try {
      const [res, res2] = await SaavanService.getArtistsSongs(id, 1, 2);
      const data1 = res.data.data.results;
      const data2 = res2.data.data.results;
      const data = [...data1, ...data2];
      dispatch({ type: GET_ARTIST_SONGS_SUCESS, payload: data });
    } catch (error) {
      dispatch({ type: GET_ARTIST_SONGS_ERROR });
    }
  };

  const ArtistAlbums = async (id) => {
    dispatch({ type: GET_ARTIST_ALBUMS_BEGIN });
    try {
      const res = await SaavanService.getArtistsAlbums(id);
      const data = res.data.data.results;
      dispatch({ type: GET_ARTIST_ALBUMS_SUCESS, payload: data });
    } catch (error) {
      dispatch({ type: GET_ARTIST_ALBUMS_ERROR });
    }
  };

  const HandleAlert = () => {
    dispatch({ type: ALERT_SHOW });
  };

  return (
    <MusicContext.Provider
      value={{
        ...state,
        singleAlbums,
        SinglePlaylist,
        HandleAlert,
        SingleArtist,
        ArtistSongs,
        ArtistAlbums,
        ...homeState,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicContext = () => {
  return useContext(MusicContext);
};
