import { useState } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Plus, X } from "lucide-react";
import { usePersistedState } from "@/hooks/usePersistedState";
import { EditableText } from "@/components/EditableText";

interface CalendarEvent {
  id: string;
  date: string; // ISO string
  title: string;
  time: string;
}

export function CalendarWidget() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = [...Array(7)].map((_, i) => addDays(startDate, i));
  
  const [events, setEvents] = usePersistedState<CalendarEvent[]>("rpg_calendar_events", [
    { id: "1", date: new Date().toISOString(), title: "Team Meeting", time: "10:00" }
  ]);

  const selectedDateEvents = events.filter(event => 
    isSameDay(new Date(event.date), selectedDate)
  );

  const addEvent = () => {
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      date: selectedDate.toISOString(),
      title: "Nouvel événement",
      time: "09:00"
    };
    setEvents([...events, newEvent]);
  };

  const updateEvent = (id: string, field: keyof CalendarEvent, value: string) => {
    setEvents(events.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl p-5 border-2 border-purple-400 shadow-[0_6px_0_0_#A855F7]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-display font-bold text-2xl text-purple-500 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6" />
          Schedule
        </h3>
        <span className="text-sm font-bold text-purple-400 bg-purple-50 px-2 py-1 rounded-lg capitalize">
          {format(new Date(), "MMMM yyyy", { locale: fr })}
        </span>
      </div>

      <div className="flex justify-between mb-4 overflow-x-auto pb-2 no-scrollbar">
        {weekDays.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());
          const hasEvents = events.some(e => isSameDay(new Date(e.date), date));
          
          return (
            <button
              key={date.toString()}
              onClick={() => setSelectedDate(date)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[2.5rem] h-14 rounded-xl border-2 transition-all relative mx-0.5",
                isSelected 
                  ? "bg-purple-500 border-purple-600 text-white shadow-md scale-110 z-10" 
                  : "bg-white border-purple-100 text-gray-400 hover:border-purple-300",
                isToday && !isSelected && "border-purple-300 bg-purple-50 text-purple-500"
              )}
            >
              <span className="text-[10px] font-bold uppercase">{format(date, "EEE", { locale: fr })}</span>
              <span className="text-lg font-display font-bold">{format(date, "d")}</span>
              {hasEvents && !isSelected && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-purple-400" />
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-2 min-h-[100px]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-gray-400 uppercase">
            {format(selectedDate, "EEEE d MMMM", { locale: fr })}
          </span>
          <button 
            onClick={addEvent}
            className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded hover:bg-purple-200 font-bold flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Ajouter
          </button>
        </div>

        {selectedDateEvents.length === 0 && (
          <div className="text-center py-4 text-gray-300 text-sm italic">
            Rien de prévu
          </div>
        )}

        {selectedDateEvents.map((event) => (
          <div key={event.id} className="p-2 bg-purple-50 rounded-xl border border-purple-100 flex gap-2 items-center group relative">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <EditableText 
                initialValue={event.title}
                onSave={(val) => updateEvent(event.id, "title", val)}
                className="text-sm font-medium text-gray-700 block truncate w-full bg-transparent"
              />
            </div>
            <EditableText 
              initialValue={event.time}
              onSave={(val) => updateEvent(event.id, "time", val)}
              className="text-xs font-bold text-purple-400 bg-transparent w-10 text-right"
            />
            <button 
              onClick={() => deleteEvent(event.id)}
              className="opacity-0 group-hover:opacity-100 absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-0.5 shadow-sm transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
