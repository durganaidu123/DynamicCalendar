import io from 'socket.io-client';

export const applyCategoryColor = (args, currentView) => {
   let categoryColor = args[0 || 'data'].CategoryColor;

   if (!args.element || !categoryColor) {
      return;
   }
   if (currentView === 'Agenda') {
      args.element.firstChild.style.borderLeftColor = categoryColor;
   } else {
      args.element.style.backgroundColor = categoryColor;
   }
};

export const setColorForDescription = (descTemp) => {
   let desc = descTemp.toLowerCase();
   if (!desc.length) {
      return null;
   }
   const res = desc.match(/(career|leisure|financial|social)/gi) || '';
   // replacement to original switch case
   let color = {
      career: '#357cd2',
      financial: '#00bdae',
      social: '#1aaa55',
      leisure: '#f57f17',
   }[res[0]];
   return color || '';
};

export const getSocketConnection = () => {
   let HOST = window.location.origin.replace(/^http/, 'ws');
   if (HOST.includes('localhost')) {
      return io.connect(HOST);
   } else if (HOST.includes('onrender')) {
      return io.connect(process.env.REACT_APP_API_URL);
   } else {
      return io();
   }
};
