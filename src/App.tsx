import React, { useState } from "react";

// Component hiển thị sơ đồ ghế và xử lý chọn ghế
const ShipMap = ({
  busTypeDecks,
  tripPrices,
  bookedSeats,
  blockedSeats,
  onSelectSeat,
  selectedSeats,
}) => {
  // Hàm kiểm tra xem ghế có bị chặn hoặc đã được đặt trước không
  const isSeatUnavailable = (deckId, seatIndex) => {
    const seatId = `${deckId}-${seatIndex}`;
    return bookedSeats.includes(seatId) || blockedSeats.includes(seatId);
  };

  // Hàm render sơ đồ ghế của từng tầng
  const renderDeckSeats = (deck) => {
    const seatTypeInfoArr = JSON.parse(deck.seatTypeInfo);
    return seatTypeInfoArr.map((seatTypeId, index) => {
      // Tìm thông tin giá và loại ghế tương ứng
      const seatPriceInfo = tripPrices.find(
        (price) =>
          price.seatTypeId === Number(seatTypeId) &&
          price.deckId === deck.deckId
      );

      const isSelected = selectedSeats.some(
        (seat) => seat.seatIndex === index && seat.deckId === deck.deckId
      );
      const isUnavailable = isSeatUnavailable(deck.deckId, index); // Kiểm tra ghế có bị chặn hay không

      let backgroundColor;
      if (isSelected) {
        backgroundColor = "red"; // Màu đỏ cho ghế đã chọn
      } else if (isUnavailable) {
        backgroundColor = bookedSeats.includes(`${deck.deckId}-${index}`)
          ? "gray" // Màu xám cho ghế đã đặt
          : "black"; // Màu đen cho ghế bị chặn
      } else {
        backgroundColor = seatPriceInfo?.color; // Màu ghế theo loại ghế
      }

      return (
        <div
          key={index}
          onClick={() =>
            !isUnavailable &&
            handleSelectSeat(deck.deckId, index, seatPriceInfo)
          }
          style={{
            border: "1px solid black",
            padding: "10px",
            margin: "5px",
            backgroundColor,
            height: "100px",
            cursor: seatTypeId && !isUnavailable ? "pointer" : "not-allowed",
            opacity: isSelected ? 0.5 : 1,
          }}
        >
          {seatTypeId ? seatPriceInfo.seatTypeName : ""}
        </div>
      );
    });
  };

  // Hàm xử lý khi người dùng chọn ghế
  const handleSelectSeat = (deckId, seatIndex, seatPriceInfo) => {
    if (!seatPriceInfo) return;

    const seatExists = selectedSeats.find(
      (seat) => seat.seatIndex === seatIndex && seat.deckId === deckId
    );

    if (seatExists) {
      // Nếu ghế đã được chọn, bỏ chọn ghế
      onSelectSeat(
        selectedSeats.filter(
          (seat) => !(seat.seatIndex === seatIndex && seat.deckId === deckId)
        )
      );
    } else {
      // Thêm ghế vào danh sách ghế đã chọn
      onSelectSeat([...selectedSeats, { deckId, seatIndex, ...seatPriceInfo }]);
    }
  };

  return (
    <div>
      <h3>Seat Map</h3>
      {busTypeDecks.map((deck) => (
        <div key={deck.deckId}>
          <h4>{deck.name}</h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${deck.noOfColumns}, 110px)`,
            }}
          >
            {renderDeckSeats(deck)}
          </div>
        </div>
      ))}
    </div>
  );
};

// Component hiển thị danh sách ghế đã chọn
const SelectedSeatsList = ({ selectedSeats }) => {
  const groupedSeats = selectedSeats.reduce((acc, seat) => {
    if (!acc[seat.seatTypeName]) {
      acc[seat.seatTypeName] = [];
    }
    acc[seat.seatTypeName].push(seat);
    return acc;
  }, {});

  return (
    <div>
      <h3>Selected Seats</h3>
      {Object.keys(groupedSeats).map((seatTypeName) => (
        <div key={seatTypeName}>
          <h4>{seatTypeName}</h4>
          <ul>
            {groupedSeats[seatTypeName].map((seat) => (
              <li key={`${seat.deckId}-${seat.seatIndex}`}>
                Seat {seat.seatIndex + 1} on Deck {seat.deckName} - Price: $
                {seat.finalPrice}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

// Component hiển thị mô tả các loại ghế
const SeatTypeDescriptions = ({ seatTypes, busTypeDecks }) => {
  // Lấy các loại ghế đã sử dụng trong seatTypeInfo
  const usedSeatTypes = busTypeDecks.flatMap((deck) => {
    const seatTypeInfoArr = JSON.parse(deck.seatTypeInfo);
    return seatTypeInfoArr.map((seatTypeId) => Number(seatTypeId));
  });

  // Lọc và chỉ hiển thị những loại ghế đã được sử dụng
  const filteredSeatTypes = seatTypes.filter((seatType) =>
    usedSeatTypes.includes(seatType.id)
  );

  return (
    <div>
      <h3>Seat Type Descriptions</h3>
      <ul>
        {filteredSeatTypes.map((seatType) => (
          <li key={seatType.id}>
            <span
              style={{
                backgroundColor: seatType.color,
                padding: "5px",
                color: "#fff",
              }}
            >
              {seatType.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Root component
const App = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Dữ liệu mẫu từ props
  const busTypeDecks = [
    {
      name: "Lower Deck01",
      deckOrder: 1,
      noOfRows: 12,
      noOfColumns: 4,
      noOfSeats: 48,
      seatTypeInfo:
        '["","","2","2","","","2","2","2","","2","2","2","","2","2","2","","2","2","2","","2","2","2","","2","2","2","","2","2","2","","2","2","2","","2","2","2","","2","2","2","2","2","2"]',
      deckId: 55,
    },
    {
      name: "Upper Deck",
      deckOrder: 2,
      noOfRows: 12,
      noOfColumns: 4,
      noOfSeats: 48,
      seatTypeInfo:
        '["","","2","2","","","2","2","2","","2","2","2","","2","2","2","","2","2","2","","2","2","2","","2","2","2","","2","2","2","","2","2","2","","2","2","2","","2","2","2","2","2","2"]',
      deckId: 56,
    },
  ];

  const tripPrices = [
    {
      seatTypeId: 2,
      deckId: 55,
      seatTypeName: "Normal",
      finalPrice: 30,
      deckName: "Lower Deck01",
      color: "#E5B741",
    },
    {
      seatTypeId: 2,
      deckId: 56,
      seatTypeName: "Normal",
      finalPrice: 30,
      deckName: "Upper Deck",
      color: "#E5B741",
    },
  ];

  const bookedSeats = ["55-19", "55-23"]; // Ghế đã được đặt
  const blockedSeats = ["55-18", "55-22", "55-20"]; // Ghế bị chặn

  // Danh sách loại ghế
  const seatTypes = [
    { id: 50, name: "Last Row", displayName: "LR", color: "#288BFF" },
    { id: 49, name: "Double", displayName: "DB", color: "#58C27D" },
    { id: 48, name: "Single", displayName: "S", color: "#92A5EF" },
    { id: 47, name: "Hot Seat", displayName: "HS", color: "#F24B56" },
    { id: 2, name: "Normal", displayName: "N", color: "#E5B741" },
    { id: 1, name: "VIP", displayName: "VIP", color: "#47D5D1" },
  ];

  return (
    <div>
      <ShipMap
        busTypeDecks={busTypeDecks}
        tripPrices={tripPrices}
        bookedSeats={bookedSeats}
        blockedSeats={blockedSeats}
        selectedSeats={selectedSeats}
        onSelectSeat={setSelectedSeats}
      />
      <SelectedSeatsList selectedSeats={selectedSeats} />
      <SeatTypeDescriptions seatTypes={seatTypes} busTypeDecks={busTypeDecks} />
    </div>
  );
};

export default App;
