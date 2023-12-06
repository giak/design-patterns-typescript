import getInstance from './singleton';
import { UserStore } from './userStore';
const singleton = getInstance();
singleton.setValue({ name: 'what is in a name' });
const theNameObj = singleton.getValue();
console.log(theNameObj);

const singleton1 = getInstance();
const singleton2 = getInstance();
console.log(singleton1 === singleton2);

// Can't extend the singleton
// singleton.myExtraFunc = () => { /** some logic */ }

const userStoreSingleton = getInstance();
userStoreSingleton.setValue(new UserStore());

const userStore = userStoreSingleton.getValue();
let userStoreData = <UserStore>userStore;
console.log(userStoreData);

userStoreData.add({ id: 2, name: 'Jane' });
const data = userStoreData.get(2);
console.log(`data`, data);
