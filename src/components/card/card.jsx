import './card.scss'
import { createClient } from '@supabase/supabase-js'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Variant2 } from '../loader/loader'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const StudentCard = ({ student, setStudents }) => {
    const [loading, setLoading] = useState(false)
    async function toggleActive(id) {
        setLoading(true)
        const { error } = await supabase.from('COBEP').update({ status: 'active' }).eq('ID', id)
        if (!error) {
            const { data, error: secondaryError } = await supabase.from('COBEP').select('*').eq('ID', id).single(); // 
            if (!secondaryError) {
                setStudents(prevStudents => prevStudents.map(student => id === student.ID ? { ...student, ...data } : { ...student }))
                setLoading(false)
            }

            toast.success(`${student.Names} is now an active member`, {
                theme: "dark",
            })
        }
    }
    const gender = {
        ' M': 'Male',
        ' F': 'Female'
    }
    const department = (matricNumber) => {
        if (matricNumber.length == 14) {
            return `${matricNumber[6]}${matricNumber[7]}`
        } else if (matricNumber.length == 15) {
            return `${matricNumber[7]}${matricNumber[8]}`
        }
    }
    const returnCorrectDepartment = (apprev) => {
        switch (apprev) {
            case 'CE':
                return 'CEE'
            case 'EC':
                return 'ECE'
            case 'MS':
                return 'MSE'
            case 'FE':
                return 'FEE' 
            default:
                return 'Not Found'
        }
    }

    return (
        <div className="student_card">
            <div className="top">
                <p className="user_name">{student.Names}</p>
                {loading ? <Variant2 /> : <div className="toggler" onClick={() => toggleActive(student.ID)} style={student.status == 'active' ? { backgroundColor: '#0B6623' } : {}}>
                    <div className="ball" style={student.status == 'active' ? { right: '.3rem', backgroundColor: '#000000' } : { left: '.3rem' }}></div>
                </div>}
            </div>
            <div className="bottom">
                <div className="col_1">
                    <div className="item">
                        <h4>Matric No:</h4>
                        <p>{student.Matric_Number}</p>
                    </div>

                    <div className="item">
                        {console.log(student)}
                        <h4>department:</h4>
                        <p>{returnCorrectDepartment(department(`${student.Matric_Number}`))}</p>
                    </div>
                </div>
                <div className="col_2">
                    <div className="item">
                        <h4>gender:</h4>
                        <p>{gender[student['Gender']]}</p>
                    </div>
                    <div className="item">
                        <h4>group status:</h4>
                        <p>{student.status == 'active' ? 'active' : 'inactive'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}


export const DefaultCard = ({ students }) => {
    const activeStudents = []

    students.forEach(students => {
        if (students.status == 'active') {
            activeStudents.push(students)
        }
    });
    return (
        <div className="default_card">
            <h4>No of students in Group: <span>52</span></h4>
            <h4>Total Students: <span>{students.length}</span></h4>
            <h4>Active Students: <span>{activeStudents.length}</span></h4>
            <h4>inactive Students: <span>{(students.length) - (activeStudents.length)}</span></h4>
        </div>
    )
}