const { Model, DataTypes } = require('sequelize');
const { mysql } = require('../../config/db')

class Task extends Model {}

Task.init({
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
    },
    details: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.ENUM('pending', 'started', 'finished'),
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    startedAt: {
        type: DataTypes.DATE,
    },
    finishedAt: {
        type: DataTypes.DATE,
    },
    createdBy: {
        type: DataTypes.STRING,
    },
    }, {
    sequelize: mysql.getConnection(),
    modelName: 'Task',
    freezeTableName: true,
    timestamps: false
});

(async () => {
    await Task.sync();
})()

module.exports = Task