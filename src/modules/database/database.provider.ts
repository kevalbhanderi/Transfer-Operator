import {
  Bucket,
  Cluster,
  Collection,
  connect,
  CouchbaseError,
} from 'couchbase';

let collection: Collection;
let bucket: Bucket;
let cluster: Cluster;
export const cbConnect = async () => {
  try {
    cluster = await connect(process.env.COUCHBASE_URL, {
      username: process.env.COUCHBASE_USER,
      password: process.env.COUCHBASE_PASS,
    });
    bucket = cluster.bucket(process.env.COUCHBASE_BUCKET);

    // collection = bucket.defaultCollection();
    collection = bucket.scope('_default').collection('_default');
  } catch (e) {
    console.log(e, 'error in couchbase connection');
  }
};

// It performs get() operation on bucket & returns response
export const getObject: any | CouchbaseError = async (key: string) => {
  try {
    const info = await collection.get(key);
    return info.content;
  } catch (e) {
    console.log(e, 'error in getObject');
  }
};

// it runs expected N1QL query & returns result
export const N1QL = async (query: string) => {
  try {
    const cbQuery = await cluster.query(query);
    return cbQuery.rows;
  } catch (e) {
    console.log(e, 'error in N1QL query');
  }
};

// It performs upsert() operation on bucket & returns response
export const upsertObject = async (key: string, data: any) => {
  try {
    await collection.upsert(key, data);
  } catch (e) {
    console.log(e, 'error in upsert object');
  }
};

// It performs insert() operation on bucket & return response
export const insertObject = async (key: string, data: any) => {
  try {
    await collection.insert(key, data);
  } catch (e) {
    console.log(e, 'error in insert object');
  }
};

// It performs remove() operation on bucket & returns response
export const deleteObject = async (key: string) => {
  try {
    await collection.remove(key);
  } catch (e) {
    console.log(e, 'error in delete object');
  }
};
