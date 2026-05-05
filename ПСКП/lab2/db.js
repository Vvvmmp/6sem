const Sequelize = require('sequelize');
const Model = Sequelize.Model;

const sequelize = new Sequelize('LVK', 'User1', '15151515User', {
    host: 'localhost',
    dialect: 'mssql',
    dialectOptions: {
        options: { encrypt: false, trustServerCertificate: true }
    },
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    logging: false
});

class Faculty extends Model{};
class Pulpit extends Model{};
class Teacher extends Model{};
class Subject extends Model{};
class Auditorium_type extends Model{};
class Auditorium extends Model{};

function internalORM(sequelize){
    Faculty.init(
        {
            faculty: {type: Sequelize.STRING, allowNull:false, primaryKey:true},
            faculty_name:{type:Sequelize.STRING, allowNull:false}
        },
        { sequelize, modelName:'Faculty', tableName:'FACULTY', timestamps:false }
    );
    Pulpit.init (
        {
            pulpit: {type:Sequelize.STRING, allowNull:false, primaryKey:true},
            pulpit_name:{type:Sequelize.STRING, allowNull:false},
            faculty: {type: Sequelize.STRING, allowNull:false, references: {model:Faculty, key:'faculty'}}
        },
        { sequelize, modelName: 'Pulpit', tableName:'PULPIT', timestamps:false }
    );
    Teacher.init (
        {
            teacher: {type:Sequelize.STRING, allowNull:false, primaryKey:true},
            teacher_name:{type:Sequelize.STRING, allowNull:false},
            pulpit: {type: Sequelize.STRING, allowNull:false, references: {model:Pulpit, key:'pulpit'}}
        },
        { sequelize, modelName: 'Teacher', tableName:'TEACHER', timestamps:false }
    );
    Subject.init (
        {
            subject: {type:Sequelize.STRING, allowNull:false, primaryKey:true},
            subject_name:{type:Sequelize.STRING, allowNull:false},
            pulpit: {type: Sequelize.STRING, allowNull:false, references: {model:Pulpit, key:'pulpit'}}
        },
        { sequelize, modelName: 'Subject', tableName:'SUBJECT', timestamps:false }
    );
    Auditorium_type.init (
        {
            auditorium_type: {type:Sequelize.STRING, allowNull:false, primaryKey:true},
            auditorium_typename:{type:Sequelize.STRING, allowNull:false},
        },
        { sequelize, modelName: 'Auditorium_type', tableName:'AUDITORIUM_TYPE', timestamps:false }
    );
    Auditorium.init (
        {
            auditorium: {type:Sequelize.STRING, allowNull:false, primaryKey:true},
            auditorium_name:{type:Sequelize.STRING, allowNull:false},
            auditorium_capacity:{type:Sequelize.INTEGER, allowNull:false},
            auditorium_type: {type: Sequelize.STRING, allowNull:false, references: {model:Auditorium_type, key:'auditorium_type'}}
        },
        { sequelize, modelName: 'Auditorium', tableName:'AUDITORIUM', timestamps:false }
    );
};

internalORM(sequelize);

module.exports = {
    sequelize,
    models: { Faculty, Pulpit, Teacher, Subject, Auditorium_type, Auditorium },
    init: async () => {
        try {
            await sequelize.authenticate();
            console.log('Sequelize connected to MSSQL');
        } catch (e) {
            console.error('DB Connection error:', e);
        }
    }
};