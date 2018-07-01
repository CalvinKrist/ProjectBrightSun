console.log("Teacher loaded . . .");

function Teacher() {
	Provisioner.call(this);
	
	console.log("TEACHER CREATED");
}

Teacher.prototype = Object.create(Provisioner.prototype);
Teacher.prototype.constructor = Teacher;

Teacher.prototype.testFunc = function() {
	console.log("teacher's test");
};