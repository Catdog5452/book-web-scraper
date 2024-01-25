import axios from "axios";
import { useEffect, useReducer } from "react";

const BASE_URL = "https://books.toscrape.com/";

const URL = "https://corsproxy.io/?" + encodeURIComponent(BASE_URL);

const ACTIONS = {
  MAKE_REQUEST: "make-request",
  GET_DATA: "get-data",
  ERROR: "error",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST:
      return { loading: true, content: {} };
    case ACTIONS.GET_DATA:
      return {
        ...state,
        loading: false,
        content: action.payload.content,
      };
    case ACTIONS.ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        content: {},
      };
    default:
      return state;
  }
}

export default function useFetchBooks(page) {
  const [state, dispatch] = useReducer(reducer, {
    content: {},
    loading: true,
  });

  useEffect(() => {
    dispatch({ type: ACTIONS.MAKE_REQUEST });

    axios
      .request({
        method: "GET",
        url: URL,
      })
      .then((response) => {
        dispatch({
          type: ACTIONS.GET_DATA,
          payload: {
            content: response.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: ACTIONS.ERROR,
          payload: {
            error,
          },
        });
      });
  }, [page]);

  return state;
}
