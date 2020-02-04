import { authHeader } from './auth-header';

const fixedRequestOptions = () => {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...authHeader()
    }
  };
}


const defaultGetResult = success => {
  return json => {
    if (json.message) {
      throw new Error(json.message);
    }
    else
      success(json);
  };
};

const defaultCatchError = error => {
  return er => {
    console.log(er);
    error(er.message);
  }
}

const defaultFetchChain = (fetch, success, error) => {
  fetch
    .then(response => {
      if (response.ok)
        return response.json();
      return response.json();
    })
    .then(defaultGetResult(success))
    .catch(defaultCatchError(error));
}

const handleResponse = (response) => {
  if (response.ok) {
    return response.text()
      .then((text) => text.length ? JSON.parse(text) : {})
  } else {
    return Promise.reject(response.statusText);
  }
};

function handleError(error) {
  return Promise.reject(error && error.message);
}

const defaultFetch = (url, data, options) => {
  const body = data ? JSON.stringify(data) : null;
  return fetch(url, { ...fixedRequestOptions(), ...options, body }).then(handleResponse, handleError);
};

const fileFetch = (url, data, options) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      ...authHeader()
    },
    body: data,
    ...options
  })
    .then(handleResponse, handleError);
}

const defaultBlobFetch = (url, data) => {
  const body = JSON.stringify(data);
  return fetch(url, { ...fixedRequestOptions(), body })
    .then(response => {
      if (response.ok)
        return response.blob();
      return response.text().then(text => Promise.reject(text));
    }, error => {
      return Promise.reject(error);
    });
}

export { fixedRequestOptions, defaultFetchChain, handleResponse, handleError, defaultFetch, defaultBlobFetch, fileFetch };
