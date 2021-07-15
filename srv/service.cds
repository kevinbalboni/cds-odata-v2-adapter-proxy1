using {assert.check as assertDemo} from '../db/schema';


service AssertCheckService {
  @Capabilities  : {
    Insertable : true,
    Updatable  : true,
    Deletable  : true
  }
  entity Packages as select from assertDemo.Packages actions {
    action actionAssertCheckCreate() returns String;
    action actionAssertCheckUpdate() returns String;    
    action actionAssertCheckUnique() returns String;        
  };

}
