import "./home.scss";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { Variant1 } from "../../components/loader/loader";
import { DefaultCard, StudentCard } from "../../components/card/card";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Home = () => {
    const [students, setStudents] = useState([]);
    const [matricNumber, setMatricNumber] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch students from Supabase
    const fetchStudents = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('COBEP').select('*');
        if (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to fetch student data");
        } else {
            setStudents(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStudents();
    }, []);


    // Filter students based on matric number
    const filteredStudents = students?.filter(student => student.Matric_Number.toLowerCase().replace(/\s+/g, '').includes(matricNumber.toLowerCase().replace(/\s+/g, ''))
    );

    return (
        <div className="home">
            {loading && <Variant1 />}
            <ToastContainer />
            {!loading && (
                <div className="content">
                    <div className="validate">
                        <input
                            type="text"
                            className="search"
                            value={matricNumber} // Ensure value is controlled
                            onChange={(e) => setMatricNumber(e.target.value)}
                            placeholder="Enter Matric Number"
                        />
                    </div>
                    <div className="cards">
                        {matricNumber && (
                            filteredStudents?.length > 0 ? (
                                filteredStudents?.map((student, index) => (
                                    // console.log(student)
                                    <StudentCard key={index} student={student} setStudents={setStudents} />
                                ))
                            ) : (
                                <p className="warning">No students found with that matric number</p>
                            )
                        )}
                    </div>

                    {!matricNumber && <DefaultCard students={students} />}
                </div>
            )}
        </div>
    );
}

export default Home;
