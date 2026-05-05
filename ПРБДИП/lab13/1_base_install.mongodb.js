use('Hiring_Staff')
db.createUser({
 user: "lab13_user",           
 pwd: "1515",       
 roles: [
   { role: "readWrite", db: "Hiring_Staff" } 
 ]
});

//ex3
//insert
db.candidates.insertMany([
  { name: "Иван Иванов", age: 30, skills: ["Java", "Docker", "MongoDB"], experience: 5, passport: "1234 AB", status: "hired" },
  { name: "Анна Смирнова", age: 25, skills: ["Python", "MongoDB"], experience: 3, passport: 987654, status: "interview" },
  { name: "Петр Алексеев", age: 40, skills: ["C++", "SQL"], experience: 15, status: "rejected" }, 
  { name: "Иван Сергеев", age: 22, skills: ["Go"], experience: 1, passport: "9999 CD", status: "interview" }
]);

db.trips.insertMany([
  { destination: "Минск", status: "completed", cost: 5000, duration: 5, department: "IT" },
  { destination: "Бобруйск", status: "planned", cost: 3000, duration: 3, department: "IT" },
  { destination: "Могилев", status: "completed", cost: 4500, duration: 5, department: "HR" },
  { destination: "Витебск", status: "cancelled", cost: 1000, duration: 2, department: "HR" }
]);

//update
db.candidates.updateOne(
  { name: "Анна Смирнова" },
  { $set: { status: "hired", experience: 4 } }
);

db.trips.updateMany(
  { destination: "Минск" },
  { $inc: { cost: 5100 } }
);

//ex4
// $gt
db.candidates.find({ age: { $gt: 25 } });

// $in
db.candidates.find({ skills: { $in: ["MongoDB"] } });

// $exists
db.candidates.find({ passport: { $exists: false } });

// $type
db.candidates.find({ passport: { $type: "number" } });

// $regex
db.candidates.find({ name: { $regex: "^Иван" } });

//ex5
db.candidates.find(
  { status: "hired" }, 
  { name: 1, skills: 1, _id: 0 } 
);


//ex6
db.trips.countDocuments({});

db.candidates.countDocuments({ status: "interview" });

//ex7
//started count from first candidate!!
db.candidates.find().skip(1).limit(3);//res = 2 candidates

//ex8
db.trips.distinct("status");

//ex9-10
db.trips.aggregate([
  { 
    $match: { status: "completed" } 
  },
  {
    $group: {
      _id: { gorod: "$destination", dney: "$duration" }, 
      totalCost: { $sum: "$cost" }, 
      tripsCount: { $sum: 1 } 
    }
  }
]);

db.candidates.aggregate([
  { 
    $match: {} //empty
  },
  {
    $group: {
      _id: "$status", 
      averageAge: { $avg: "$age" } 
    }
  }
]);