#!/bin/sh
echo "Seeding the test Mongo Database with bounties..."
mongoimport\
    --db bountyboard\
    --collection bounties\
    --drop\
    --file usr/tmp/mongo/bounties/bboard_customerId_test.json\
    --jsonArray

echo "Adding Text Index to bounties..."
mongosh usr/tmp/mongo/bounties/init.js

echo "Adding CustomerId as a field..."
mongosh < usr/tmp/mongo/bounties/addCustomerId.js

echo "Adding Customers..."
mongoimport\
    --db bountyboard\
    --collection customers\
    --drop\
    --file usr/tmp/mongo/customers/seed_customers.json\
    --jsonArray
