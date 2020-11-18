
import {appConfig} from '../config/app';

const getPath = file => {
  if (file) {
    /** if the file already has the fileBaseUrl information i.e,
     * in the case of a updated file simply return the uri else add the fileBaseUrl */
    if (
      file.includes(appConfig.emailAuthAPIEndPoint) ||
      file.includes(appConfig.emailAuthAPIEndPoint)
    ) {
      return file;
    }
    /** Not appending Date here helps in caching of files */
    return `${appConfig.emailAuthAPIEndPoint}/${file}`;
  }
  return '';
};

export default getPath;
