import { LogoModel } from './logo-model';
export class LogoAbstract implements LogoModel {
  url = ''; // todo: using a preloader url till logo is loading?
  md5 = '';
  width = 0;
  height = 0;
}
