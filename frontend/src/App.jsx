import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetch('http://localhost:5000/courses')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setData(data);
        setCourses([...new Set(data.map(item => item.name))]);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleCourseChange = (event) => {
    const course = event.target.value;
    setSelectedCourse(course);

    const courseData = data.filter(item => item.name === course);
    setTeachers([...new Set(courseData.map(item => item.teacher))]);
  };

  const handleTeacherChange = (event) => {
    const teacher = event.target.value;
    setSelectedTeacher(teacher);

    const studentsData = data
      .filter(item => item.name === selectedCourse && item.teacher === teacher)
      .flatMap(item => item.students);

    setStudents(studentsData);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleStudentChange = (event) => {
    const student = event.target.value;
    if (event.target.checked) {
      setSelectedStudents([...selectedStudents, student]);
    } else {
      setSelectedStudents(selectedStudents.filter(s => s !== student));
    }
  };

  const handleSubmit = () => {
    const logEntry = {
      dateFilledByUser: date,
      courseName: selectedCourse,
      teacherName: selectedTeacher,
      students: selectedStudents,
    };

    fetch('http://localhost:5000/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logEntry),
    })
      .then(response => response.json())
      .then(data => {
        window.alert("Success");
        console.log('Log entry created:', data);
        setSelectedCourse('');
        setSelectedTeacher('');
        setStudents([]);
        setSelectedStudents([]);
        setDate(new Date().toISOString().split('T')[0]);
      })
      .catch(error => { window.alert("Success"); console.error('Error creating log entry:', error) });
  };

  return (
    <main className=' w-full h-[88svh] grid place-items-center'>
      <div className=' grid place-items-center gap-5 text-white p-10 border border-slate-100 rounded-md min-h-[25%]'>

        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          className='bg-transparent border border-slate-400 rounded-lg px-2'
        />
        <select value={selectedCourse} onChange={handleCourseChange} className=' bg-transparent border border-slate-400 rounded-lg'>
          <option value="" className=' text-black'>--Select Course--</option>
          {courses.map((course, index) => (
            <option key={index} value={course} className=' text-black'>{course}</option>
          ))}
        </select>

        {selectedCourse && (
          <select value={selectedTeacher} onChange={handleTeacherChange} className=' bg-transparent border border-slate-400 rounded-lg'>
            <option value="" className=' text-black'>--Select Teacher--</option>
            {teachers.map((teacher, index) => (
              <option key={index} value={teacher} className=' text-black' >{teacher}</option>
            ))}
          </select>
        )}

        {selectedTeacher && (
          <div>
            <h3>Students:</h3>
            <ul>
              {students.map((student, index) => (
                <li key={index}>
                  <label>
                    <input
                      type="checkbox"
                      value={student}
                      onChange={handleStudentChange}
                      checked={selectedStudents.includes(student)}
                    />
                    {student}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedCourse && selectedTeacher && (
          <div>
            <button type='button' className=' bg-mybl px-4 py-2 rounded-lg' onClick={handleSubmit}>SUBMIT</button>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
