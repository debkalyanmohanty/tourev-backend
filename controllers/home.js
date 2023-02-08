const Employee = require('../models/Employee');
exports.addEmployee = (req,res,next) => {
    const name = req.body.Name;
    const designation = req.body.Designation;
    const image = req.file;
    console.log(image);
    const imageUrl = image.path;
    const employee = new Employee({
        name: name,
        designation: designation,
        imageUrl: imageUrl
  
    });
     employee.save()
     .then(result => {
        return res.redirect('/');

     })
     .catch(err => {
        console.log(err);
     })
} 
exports.getEmployee = (req,res,next) => {
    res.render('employee',{
        title: 'Employee-Dets'
    });
      
    }


exports.getHome = (req,res,next) => {
    Employee.find()
    .then(employees => {
        res.render('index', {
            employ: employees
            
        })
    }) 
}