/***
 * Seeding script to add a new `CustomerId` field to all current bounties 
 * in the existing database schema.
 * 
 * The default value of this field is set to the Bankless .
 */
const bountyboard = db.getSiblingDB('bountyboard');
bountyboard.bounties.updateMany(
  {},
  {
    $set: {
      CustomerId: "834499078434979890"
    }
  }
);