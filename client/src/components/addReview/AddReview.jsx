import React, { useState, useEffect, useCallback } from 'react'
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import AddValue from '../addValue/AddValue';
import './AddReview.scss';
import RatingStars from '../ratingStars/RatingStars';
import Toast from '../../components/Toast/Toast';

const AddReview = ({ formValues, setFormValues }) => {
    const [location, setLocation] = useState('');
    const [hotel, setHotel] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [locations, setLocations] = useState([]);
    const [hotels, setHotels] = useState([]);
    const updateFormValues = useCallback((key, value) => {
        setFormValues((prev) => ({ ...prev, [key]: value }));
    }, [setFormValues]);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null); // { type, text }

    useEffect(() => {
        const getLocations = async () => {
            const l = await fetch('http://localhost:8080/locations').then((res) => res.json());
            setLocations(l);
        }
        getLocations();
    }, []);

    useEffect(() => {
        const getHotels = async () => {
            const h = await fetch(`http://localhost:8080/hotels?location=${location.toLowerCase()}`).then((res) => res.json());
            console.log(h);
            setHotels(h);
        }
        location && getHotels();
    }, [location]);

    useEffect(() => {
        if (location) {
            updateFormValues('location', location);
        }
        if (hotel) {
            updateFormValues('hotel', hotel);
        }
    }, [location, hotel, updateFormValues])
    

    

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return; // guard against double submits

        if (!validateEmail(formValues.email)) {
            setEmailError(true);
            setToast({ type: 'error', text: 'Please enter a valid email before submitting.' });
            return;
        } else {
            setEmailError(false);
        }

        try {
            setSubmitting(true);
            setToast(null);

            const res = await fetch('http://localhost:8080/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formValues)
            });

            // try to parse body for more details
            let payload = null;
            try { payload = await res.json(); } catch (e) { /* ignore json parse */ }

            if (!res.ok) {
                let errText;
                if (payload) {
                    errText = payload.message || JSON.stringify(payload);
                } else {
                    errText = await res.text().catch(() => res.statusText || 'Unknown error');
                }
                setToast({ type: 'error', text: `Failed to add review: ${errText}` });
            } else {
                // success - show server detail if present
                let successText = 'Review added successfully.';
                if (payload) {
                    if (payload.message) successText = payload.message;
                    else if (payload.id) successText = `Review #${payload.id} added`;
                }
                setToast({ type: 'success', text: successText });
                // clear form values to initial state
                setFormValues({ username: '', location: '', hotel: '', review: '', rating: 1, email: '' });
            }
        } catch (err) {
            setToast({ type: 'error', text: `Error: ${err.message}` });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
        <form className={`form-control ${submitting ? 'is-disabled' : ''}`} onSubmit={handleSubmit} aria-busy={submitting}>
            <h1 className="form-group">Add Review</h1>
            <div className="form-group">
                <TextField
                    required
                    id="standard-required"
                    label="Full Name"
                    variant="standard"
                    className="form-input"
                    value={formValues.username}
                    onChange={(e) => updateFormValues('username', e.target.value)}
                />
                
                <TextField
                    required
                    id="standard-required"
                    label="Email"
                    variant="standard"
                    className="form-input"
                    error={emailError}
                    helperText={emailError ? 'Please enter a valid email' : ''}
                    value={formValues.email}
                    onChange={(e) => updateFormValues('email', e.target.value)}
                />
            </div>
            <div className="form-group">
                <AddValue type="Location" value={location} setValue={setLocation} options={locations} />
                <AddValue type="Hotel" value={hotel} setValue={setHotel} options={hotels} disabled={!formValues.location} />
            </div>
            <div className="form-group">
                <RatingStars count={7} values={formValues} setValues={setFormValues} />
                {/* <RatingStars count={7} values={formValues} setValues={setFormValues} /> */}
                <TextareaAutosize
                    required
                    className="form-input"
                    aria-label="minimum height"
                    minRows={5}
                    placeholder="Add your Review *"
                    style={{ maxWidth: '39%', minWidth: '39%', padding: '0.5%'}}
                    value={formValues.review}
                    onChange={(e) => updateFormValues('review', e.target.value)}

                />
            </div>
            <div className="form-group">
                <button className="submit" type="submit" disabled={submitting} aria-busy={submitting}>
                    {submitting ? (
                        <>
                            <span className="loader" aria-hidden="true" /> Submitting...
                        </>
                    ) : (
                        'Submit'
                    )}
                </button>
            </div>
            {submitting && <div className="form-overlay" aria-hidden="true" />}
        </form>
                <Toast
                    toast={toast}
                    onClose={() => setToast(null)}
                    duration={toast && toast.type === 'success' ? 0 : 4000}
                />
        </>
    )
}
    
export default AddReview