import React from "react";

// Component để hiển thị từng ghế
const Seat = ({ seatTypeName, seatPrice, areaColor }) => {
  const seatStyle = {
    width: "40px",
    height: "40px",
    margin: "5px",
    backgroundColor: seatPrice ? areaColor : "#ccc", // Màu sắc dựa trên vùng
    border: seatTypeName === "VIP" ? "2px solid gold" : "1px solid black", // Nếu là VIP thì viền vàng
    display: "inline-block",
    textAlign: "center",
    lineHeight: "40px",
  };

  return (
    <div style={seatStyle}>
      {seatPrice ? seatTypeName : ""}{" "}
      {/* Nếu có seatPrice, hiển thị seatTypeName, nếu không thì để trống */}
    </div>
  );
};

// Component để hiển thị bản đồ tầng
const DeckMap = ({ deck, listArea }) => {
  const { noOfRows, noOfColumns, seatPrices } = deck;

  // Parse chuỗi JSON thành mảng
  const seatTypeInfo = JSON.parse(deck.seatTypeInfo);
  const areaInfo = JSON.parse(deck.areaInfo);

  // Tạo map id loại ghế -> thông tin giá và tên ghế
  const seatPriceMap = seatPrices.reduce((map, seatPrice) => {
    map[seatPrice.seatTypeId] = seatPrice;
    return map;
  }, {});

  // Tạo map id loại vùng -> thông tin vùng
  const areaMap = areaInfo.reduce((map, area) => {
    const areaData = listArea.find((a) => a.name === area.name);
    area.positionArea.forEach((row) => {
      row.forEach((seatIndex) => {
        map[seatIndex] = areaData;
      });
    });
    return map;
  }, {});

  // Render bản đồ ghế
  return (
    <div>
      <h2>{deck.name}</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${noOfColumns}, 50px)`,
        }}
      >
        {seatTypeInfo.map((seatTypeId, index) => {
          const seatPrice = seatPriceMap[seatTypeId];
          const seatTypeName = seatPrice ? seatPrice.seatTypeName : null;
          const area = areaMap[index];

          return (
            <Seat
              key={index}
              seatTypeName={seatTypeName}
              seatPrice={seatPrice}
              areaColor={area ? area.color : "#fff"} // Nếu không thuộc vùng nào, màu nền trắng
            />
          );
        })}
      </div>
    </div>
  );
};

// Component chính để hiển thị sơ đồ con tàu
const ShipMap = ({ busTypeDesks, listArea }) => {
  return (
    <div>
      {busTypeDesks.map((deck) => (
        <DeckMap key={deck.id} deck={deck} listArea={listArea} />
      ))}
    </div>
  );
};

export default ShipMap;
