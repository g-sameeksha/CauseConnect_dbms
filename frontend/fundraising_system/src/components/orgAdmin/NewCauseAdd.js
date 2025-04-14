import React from 'react'
import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";

const NewCauseAdd = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target_amount: "",
    image : null
  });


  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [preview, setPreview] = useState(null); // For image preview
  const [descError, setDescError] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleBlur = () => {
    const wordCount = formData.description.trim().split(/\s+/).length;
    setDescError(wordCount < 10); 
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/create_cause/",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("access")}` ,
                      "Content-Type": "multipart/form-data" }},
      );
      setSuccessMessage("Cause added successfully!");
      setFormData({ title: "", description: "", target_amount: "" });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Failed to add cause. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file }); // Change logo to image (fix)
      setPreview(URL.createObjectURL(file)); // Set preview URL
    }
}
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Add New Cause</h2>
      <Card className="shadow-lg border-0 p-4">
        <Card.Body>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group className="mb-3">
              <Form.Label className='dark-label'>Cause Title :</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder='Enter title of the cause'
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className='dark-label'>Description :</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                minLength={50}  
                placeholder="Enter a detailed description"

              />
              {descError && <p className="text-danger">Please provide a more detailed description.</p>}

               
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className='dark-label'>Target Amount ($) :</Form.Label>
              <Form.Control
                type="number"
                name="target_amount"
                value={formData.target_amount}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className='dark-label'>Relevent Image :</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*" 
                onChange={handleImageChange}
                
              />
               {preview && <img src={preview} alt="Preview" className="img-fluid rounded mt-2" style={{ maxWidth: "200px" }} />}
             
          
            </Form.Group>

            

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : "Add Cause"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NewCauseAdd;
