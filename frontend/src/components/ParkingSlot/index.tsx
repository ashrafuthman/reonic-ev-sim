import React, { useEffect, useRef, useState } from "react";
import EvIcon from "../../assets/ev.svg";
import EvCharging from "../../assets/ev-charging.svg";
import Car from "../../assets/car.svg";
import "./styles.css";
import type { Charger } from "../../api/getChargers";


const LEAVE_MS = 600;

const ParkingSlot: React.FC<{ slot: Charger }> = ({ slot }) => {
  const isActive = Boolean(slot && slot.isActive);
  const percentageComplete = slot?.session?.percentageComplete ?? 0;
  const kWhNeeded = slot?.session?.kWhNeeded ?? 0;
  const deliveredKWh = +(kWhNeeded * (percentageComplete / 100)).toFixed(1);
  const remainingKWh = +(kWhNeeded * ((slot?.session?.percentageRemaining ?? 0) / 100)).toFixed(1);
  const remainingMinutes = slot?.session?.remainingMinutes ?? 0;

  // add: detect busy -> idle to show car-animate-down
  const prevActiveRef = useRef(isActive);
  const [showLeaving, setShowLeaving] = useState(false);

  useEffect(() => {
    const wasActive = prevActiveRef.current;
    if (wasActive && !isActive) {
      setShowLeaving(true);
      const t = setTimeout(() => setShowLeaving(false), LEAVE_MS);
      return () => clearTimeout(t);
    }
    prevActiveRef.current = isActive;
  }, [isActive]);

  // render car when active OR during leaving window
  const showCar = isActive || showLeaving;
  const carClass = isActive ? "car-animate" : showLeaving ? "car-animate-down" : "";

  return (
    <div className="relative flex flex-col items-center">
      {/* Header icon */}
      <div className={`w-12 h-12 mx-auto mt-4 ${isActive ? "bg-gray-200" : "bg-gray-300"} rounded rounded-b-none relative`}>
        <img src={isActive ? EvCharging : EvIcon} alt="Parking Icon"/>
        {isActive && (
          <span className="absolute -right-9 -bottom-0 text-[10px] rounded bg-black/80 text-white px-1 py-[2px]">
            11 kW
          </span>
        )}
      </div>

      <div className="flex flex-col items-stretch justify-start h-[280px] w-[180px] border-[7px] border-solid border-[#ccc] border-b-0 rounded-t-lg relative overflow-hidden p-2">
        <div className="text-xs mb-1 flex items-center justify-between">
          <span className="font-semibold">Slot {slot?.id ?? ""}</span>
          <span className={`ml-2 ${isActive ? "text-green-700" : "text-gray-500"}`}>
            {isActive ? "Charging" : "Idle"}
          </span>
        </div>

        <div className="relative flex-1 w-full">
          {slot?.session?.carName && (
            <div className="text-[11px]">{slot.session.carName}</div>
          )}

          <div className="mt-1 flex items-center gap-2">
            <div className="h-2 flex-1 rounded bg-gray-200">
              <div
                className="h-2 rounded bg-emerald-500 transition-all"
                style={{ width: `${percentageComplete}%` }}
                aria-label="progress"
              />
            </div>
            <div className="text-[11px] text-gray-700 w-6 text-right">
              {percentageComplete}%
            </div>
          </div>

          {isActive && (
            <div className="mt-1 text-[11px] w-full text-gray-700">
              {deliveredKWh} / {kWhNeeded} kWh • left {remainingKWh} kWh
            </div>
          )}

          {showCar && (
            <img
              src={Car}
              alt="Car Icon"
              className={`w-35 h-35 mt-3 rotate-90 block mx-auto ${carClass}`}
            />
          )}
        </div>

        <div className="mt-1 text-[11px] text-gray-600 flex items-center justify-between">
          <span>Ends {slot?.session?.endTime ?? "-"}</span>
          <span>{isActive ? `${remainingMinutes} min` : "-"}</span>
        </div>

        {slot && "warning" in (slot) && (slot).warning && (
          <div className="mt-1 text-[10px] text-amber-700">{(slot).warning}</div>
        )}
      </div>
    </div>
  );
};

export default ParkingSlot;
