import React, { useEffect, useState } from 'react';
import './calendar.css';
import {
   ScheduleComponent,
   ViewsDirective,
   ViewDirective,
   Day,
   Week,
   Month,
   Agenda,
   Inject,
   Resize,
   DragAndDrop,
} from '@syncfusion/ej2-react-schedule';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { client } from '../utils/api-client';
import {
   applyCategoryColor,
   setColorForDescription,
   getSocketConnection,
} from './../utils/schedulerUtills';

const PropertyPane = (props) => <div>{props.children}</div>;
const screenWidth = window.innerWidth - 61;

const socket = getSocketConnection();

const Scheduler = () => {
   const [scheduleObj, setScheduleObj] = useState();
   const [events, setEvents] = useState([]);
   const [updateEvent, setUpdateEvent] = useState(null);
   const [categoryColor, setCategoryColor] = useState(false);

   const onEventChange = async () => {
      const a = await client('event/update', { data: updateEvent });
      Object.keys(a)[0] === 'newEvent' ? setEvents((prev) => [...prev, a]) : setCategoryColor(true);
      socket.emit('update_object', a);
   };
   // --------------useEffects--------------
   // fetch events
   useEffect(() => {
      async function fetchData() {
         const eventsData = await client('events');
         setEvents(eventsData);
      }
      fetchData();
   }, [events.length]);

   // add/update an event
   useEffect(() => {
      updateEvent && onEventChange();
   }, [updateEvent]);

   // second fetch to render the color on the screen after an update to category
   useEffect(() => {
      async function fetchData() {
         const eventsData = await client('events');
         setEvents(eventsData);
      }
      categoryColor && fetchData();
      setCategoryColor(false);
   }, [categoryColor]);

   // update real-time for other users using sockets
   useEffect(() => {
      socket.on('object_updated', (data) => setEvents(data));
   }, [onEventChange]);
   // --------------useEffects--------------

   const onCalendarEventChanged = (data, isNewEvent = false) => {
      const updatedEvent = {
         Id: isNewEvent ? events.length + 1 : data.Id,
         Subject: data.Subject,
         Location: data.Location,
         StartTime: data.StartTime,
         EndTime: data.EndTime,
         Description: data.Description,
         CategoryColor: data.Description && setColorForDescription(data.Description),
      };
      setUpdateEvent(updatedEvent);
   };

   const onEventRendered = (args) => {
      applyCategoryColor(args, scheduleObj.currentView);
   };

   const change = (args) => {
      scheduleObj.selectedDate = args.value;
      // scheduleObj.dataBind();
   };
   const onDragStart = (e) => {
      e.navigation.enable = true;
   };

   const onActionComplete = (args) => {
      if (args.requestType === 'eventCreated') {
         // This block is execute after an appointment create
         onCalendarEventChanged(args.data[0], true);
      }
      if (args.requestType === 'eventChanged' && args.name === 'actionComplete') {
         // This block is execute after an appointment change
         onCalendarEventChanged(args.data[0]);
      }
      if (args.requestType === 'eventRemoved') {
         // This block is execute after an appointment remove
      }
   };

   return (
      <div className="calendar-container">
         <h2>Calendar</h2>
         <ScheduleComponent
            height={window.innerHeight - 160}
            width={screenWidth}
            ref={(schedule) => setScheduleObj(schedule)}
            selectedDate={new Date(2021, 0, 10)}
            eventSettings={{
               dataSource: (categoryColor || events.length) && events.map((item) => item),
            }}
            dragStart={onDragStart}
            actionComplete={onActionComplete}
            eventRendered={onEventRendered}>
            <ViewsDirective>
               {events.length &&
                  ['Day', 'Week', 'Month', 'Agenda'].map((item) => (
                     <ViewDirective key={item} option={item} />
                  ))}
            </ViewsDirective>
            <Inject services={[Day, Week, Month, Agenda, Resize, DragAndDrop]} />
         </ScheduleComponent>

         <PropertyPane>
            <table style={{ width: '100%', background: 'white' }}>
               <tbody>
                  <tr style={{ height: '50px' }}>
                     <td style={{ width: '100%' }}>
                        <DatePickerComponent
                           value={new Date(2021, 0, 10)}
                           showClearButton={false}
                           placeholder="Current Date"
                           floatLabelType="Always"
                           change={change}
                        />
                     </td>
                  </tr>
               </tbody>
            </table>
         </PropertyPane>
      </div>
   );
};

export default Scheduler;
