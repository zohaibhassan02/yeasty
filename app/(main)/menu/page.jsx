"use client";

import { useState } from "react";
import SideMenu from "@/components/sideMenu";
import TopNavbar from "@/components/topnavbar";
import MainContent from "@/components/maincontent";
import Banner2 from "@/components/banner2";
import Modal from "react-modal";
// import { generateQRCodePDF } from "@/lib/services/product";
import withAuth from "@/lib/withAuth";
import QRCode from 'qrcode';
import { PDFDocument, rgb } from 'pdf-lib';

async function generateQRCodePDF(link) {
  try {
    // Generate QR Code Data URL
    const qrCodeDataUrl = await QRCode.toDataURL(link);

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([500, 500]);

    // Load the QR code image into the PDF
    const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);
    const qrDims = qrImage.scale(1); // Adjust the scale for a larger image

    // Draw the QR code image on the page
    page.drawImage(qrImage, {
      x: page.getWidth() / 2 - qrDims.width / 2,
      y: page.getHeight() / 2 - qrDims.height / 2,
      width: qrDims.width,
      height: qrDims.height,
    });

    // Add some text
    page.drawText(link, {
      x: 20,
      y: 20,
      size: 10, // Smaller font size
      color: rgb(0, 0, 0),
    });

    // Serialize the PDF to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Create a blob from the PDF bytes and generate a URL
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Create a link element to download the PDF
    const linkElement = document.createElement('a');
    linkElement.href = url;
    linkElement.setAttribute('download', 'QRCode.pdf');
    document.body.appendChild(linkElement);
    linkElement.click();
    linkElement.remove();

  } catch (error) {
    console.error('Error generating QR code PDF:', error);
  }
}

const Home = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [actionType, setActionType] = useState("");

  const openModal = (action) => {
    console.log("Opening modal for action:", action);
    setActionType(action);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleConfirm = async () => {
    console.log("Action type:", actionType);
    console.log("Selected option:", selectedOption);
    closeModal();
    if (actionType === "getQRCode") {
      // try {
      //   const response = await generateQRCodePDF({ link: `http://localhost:3000/my-menu?category=${selectedOption}` });
      //   if (response.status === 200) {
      //     const blob = new Blob([response.data], { type: 'application/pdf' });
      //     const url = window.URL.createObjectURL(blob);
      //     const link = document.createElement('a');
      //     link.href = url;
      //     link.setAttribute('download', 'QRCode.pdf');
      //     document.body.appendChild(link);
      //     link.click();
      //     link.remove();
      //   }
      // } catch (error) {
      //   console.error("Error generating QR code:", error);
      // }

      await generateQRCodePDF(`http://localhost:3000/my-menu?category=${selectedOption}`);
    } else if (actionType === "getMenu") {
      const url = `/my-menu?category=${selectedOption}`;
      console.log("Redirecting to:", url);
      window.location.href = url;
    }
  };

  return (
    <div className="main-container">
      <SideMenu />
      <div className="overflow-hidden">
        <TopNavbar />
        <MainContent>
          <div className="container">
            <Banner2 bgImgSrc="/images/banner1.jpg" title="Your Digital Menu" border />
            <Banner2
              bgImgSrc="/images/banner2.jpg"
              title="Get QR Code"
              border
              onClick={() => openModal("getQRCode")}
            />
            <Banner2
              bgImgSrc="/images/banner3.jpg"
              title="Get Menu"
              border
              onClick={() => openModal("getMenu")}
            />
          </div>
        </MainContent>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Select Category"
        ariaHideApp={false} // Disable the need to set the app element
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
          content: {
            color: 'black',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            borderRadius: '10px',
            width: '300px',
            background: '#fff',
          },
        }}
      >
        <h2 style={{ textAlign: 'center' }}>Select Category</h2>
        <div style={{ margin: '10px 0' }}>
          <label>
            <input
              type="radio"
              value="draft"
              checked={selectedOption === "draft"}
              onChange={() => setSelectedOption("draft")}
            />
            Draft
          </label>
        </div>
        <div style={{ margin: '10px 0' }}>
          <label>
            <input
              type="radio"
              value="package"
              checked={selectedOption === "package"}
              onChange={() => setSelectedOption("package")}
            />
            Package
          </label>
        </div>
        <div style={{ margin: '10px 0' }}>
          <label>
            <input
              type="radio"
              value="draft,package"
              checked={selectedOption === "draft,package"}
              onChange={() => setSelectedOption("draft,package")}
            />
            Both
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button onClick={handleConfirm} style={{ padding: '10px', borderRadius: '5px', background: '#007bff', color: '#fff' }}>Confirm</button>
          <button onClick={closeModal} style={{ padding: '10px', borderRadius: '5px', background: '#dc3545', color: '#fff' }}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default withAuth(Home);
