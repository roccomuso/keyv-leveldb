import test from 'ava';
import keyvTestSuite, { keyvOfficialTests } from '@keyv/test-suite';
import Keyv from 'keyv';
import KeyvLevelDB from 'this';

keyvOfficialTests(test, Keyv, 'leveldb://DB_TEST', 'leveldb://:null:');

const store = () => new KeyvLevelDB();
keyvTestSuite(test, Keyv, store);
