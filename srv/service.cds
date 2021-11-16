//using {assert.check as assertDemo} from '../db/schema';
service WispinService @(impl : './service.js')@(path : '/odata/MyService') {

  action readPackages() returns LargeString;
  action readPackages2() returns String;

}