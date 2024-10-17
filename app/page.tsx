"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface Room {
  id: number;
  masseurName: string;
  timer: number;
  isTimerRunning: boolean;
  services: {
    massage: boolean;
    hamam: boolean;
    sauna: boolean;
  };
}

export default function Component() {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 1,
      masseurName: "",
      timer: 0,
      isTimerRunning: false,
      services: { massage: false, hamam: false, sauna: false },
    },
    {
      id: 2,
      masseurName: "",
      timer: 0,
      isTimerRunning: false,
      services: { massage: false, hamam: false, sauna: false },
    },
    {
      id: 3,
      masseurName: "",
      timer: 0,
      isTimerRunning: false,
      services: { massage: false, hamam: false, sauna: false },
    },
    {
      id: 4,
      masseurName: "",
      timer: 0,
      isTimerRunning: false,
      services: { massage: false, hamam: false, sauna: false },
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRooms((prevRooms) =>
        prevRooms.map((room) => {
          if (room.isTimerRunning && room.timer > 0) {
            return { ...room, timer: room.timer - 1 };
          } else if (room.isTimerRunning && room.timer === 0) {
            alert(`Time's up for Room ${room.id}!`);
            return { ...room, isTimerRunning: false };
          }
          return room;
        })
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleNameChange = (id: number, name: string) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === id ? { ...room, masseurName: name } : room
      )
    );
  };

  const handleTimerChange = (id: number, time: number) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === id ? { ...room, timer: time } : room
      )
    );
  };

  const handleStartTimer = (id: number) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === id ? { ...room, isTimerRunning: true } : room
      )
    );
  };

  const handleFinishMassage = (id: number) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === id
          ? {
              ...room,
              isTimerRunning: false,
              timer: 0,
              masseurName: "",
              services: { massage: false, hamam: false, sauna: false },
            }
          : room
      )
    );
  };

  const handleServiceChange = (id: number, service: keyof Room["services"]) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === id
          ? {
              ...room,
              services: {
                ...room.services,
                [service]: !room.services[service],
              },
            }
          : room
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Message Salon</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((room) => (
          <Card key={room.id}>
            <CardHeader>
              <CardTitle>Room {room.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`masseur-${room.id}`}>Masseur Name</Label>
                  <Input
                    id={`masseur-${room.id}`}
                    value={room.masseurName}
                    onChange={(e) => handleNameChange(room.id, e.target.value)}
                    placeholder="Enter masseur name"
                  />
                </div>
                <div>
                  <Label htmlFor={`timer-${room.id}`}>Timer (minutes)</Label>
                  <div className="flex space-x-2">
                    <Input
                      id={`timer-${room.id}`}
                      type="number"
                      value={room.timer}
                      onChange={(e) =>
                        handleTimerChange(room.id, parseInt(e.target.value))
                      }
                      min="0"
                    />
                    <Button
                      onClick={() => handleStartTimer(room.id)}
                      disabled={room.isTimerRunning}
                    >
                      Start
                    </Button>
                  </div>
                </div>
                <div className="flex space-x-4">
                  {Object.entries(room.services).map(([service, isChecked]) => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${service}-${room.id}`}
                        checked={isChecked}
                        onCheckedChange={() =>
                          handleServiceChange(
                            room.id,
                            service as keyof Room["services"]
                          )
                        }
                      />
                      <Label htmlFor={`${service}-${room.id}`}>
                        {service.charAt(0).toUpperCase() + service.slice(1)}
                      </Label>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => handleFinishMassage(room.id)}
                  variant="destructive"
                >
                  Finish Massage
                </Button>
                {room.isTimerRunning && (
                  <div className="flex items-center space-x-2 text-yellow-500">
                    <AlertCircle className="h-5 w-5" />
                    <span>Timer running: {room.timer} minutes left</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
