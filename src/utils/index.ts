const INIT = 'init';
const DONE = 'done';
const ERROR = 'error';

export const suspend = (promise: (path: string) => Promise<Object>, path: string) => {
    let data: Object;
    let error: Object;
    let status = INIT;
  
    const fetcher = promise(path)
      .then((fetchedData) => {
        data = fetchedData;
        status = DONE;
      })
      .catch((e) => {
        error = e;
        status = ERROR;
      });
  
    return () => {
      if (status === INIT) {
        throw fetcher;
      } else if (status === ERROR) {
        throw error;
      }
  
      return data;
    }
  };