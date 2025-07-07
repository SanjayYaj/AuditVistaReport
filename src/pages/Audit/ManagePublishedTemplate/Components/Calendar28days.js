import React, { useState, } from "react";
import { Label } from 'reactstrap'

const Calendar = (props) => {
    const [selectedDate, setSelectedDate] = useState(props.selectedDate ? props.selectedDate : null);
  const [endDate, setEndDate] = useState(null);

  // Array for 28 dates
  const dates = Array.from({ length: 28 }, (_, i) => i + 1);
    console.log(props,'props')
  // Handle date selection
  const handleDateClick = (date) => {
    setSelectedDate(date);
    const calculatedEndDate = ((date + 28 - 1 - 1) % 28) + 1; // Adjust logic to wrap correctly
    setEndDate(calculatedEndDate);
    // const calculatedEndDate = ((date + 28 - 1) % 28) + 1; // Modulo ensures wrapping
    // setEndDate(calculatedEndDate);
    props.calculatedDate({
        startDate : date,
        endDate : calculatedEndDate
    })


  };

  return (
    <div >

      <div style={styles.calendarGrid}>
        {dates.map((date) => (
          <div
            key={date}
            style={{
              ...styles.dateBox,
              backgroundColor: selectedDate === date ? "#4caf50" : "#fff",
              color: selectedDate === date ? "#fff" : "#000",
            }}
            onClick={() => handleDateClick(date)}
          >
            {date}
          </div>
        ))}
      </div>
     
    </div>
  );
};

// Inline CSS styles
const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 40px)",
    gap: "10px",
    justifyContent: "center",
  },
  dateBox: {
    width: "40px",
    height: "40px",
    lineHeight: "40px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    textAlign: "center",
    cursor: "pointer",
    userSelect: "none",
  },
  selectedDate: {
    marginTop: "20px",
    fontSize: "16px",
  },
};

export default Calendar;






// import React, { useState } from "react";

// const Calendar28Days = () => {
//   const [selectedDate, setSelectedDate] = useState(null);

//   // Array for 28 dates
//   const dates = Array.from({ length: 28 }, (_, i) => i + 1);

//   // Handle date selection
//   const handleDateClick = (date) => {
//     setSelectedDate(date);
//   };

//   return (
//     <div style={styles.container}>
//       <h3>Select a Date</h3>
//       <div style={styles.calendarGrid}>
//         {dates.map((date) => (
//           <div
//             key={date}
//             style={{
//               ...styles.dateBox,
//               backgroundColor: selectedDate === date ? "#4caf50" : "#fff",
//               color: selectedDate === date ? "#fff" : "#000",
//             }}
//             onClick={() => handleDateClick(date)}
//           >
//             {date}
//           </div>
//         ))}
//       </div>
//       {selectedDate && (
//         <p style={styles.selectedDate}>
//           You selected: <strong>{selectedDate}</strong>
//         </p>
//       )}
//     </div>
//   );
// };

// // Inline CSS styles
// const styles = {
//   container: {
//     textAlign: "center",
//     padding: "20px",
//   },
//   calendarGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(7, 40px)",
//     gap: "10px",
//     justifyContent: "center",
//   },
//   dateBox: {
//     width: "40px",
//     height: "40px",
//     lineHeight: "40px",
//     border: "1px solid #ccc",
//     borderRadius: "5px",
//     textAlign: "center",
//     cursor: "pointer",
//     userSelect: "none",
//   },
//   selectedDate: {
//     marginTop: "20px",
//     fontSize: "16px",
//   },
// };

// export default Calendar28Days;