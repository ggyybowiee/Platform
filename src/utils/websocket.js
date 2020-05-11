import RWS from 'reconnecting-websocket/dist/reconnecting-websocket-mjs';
import _ from 'lodash';
import uuid from 'uuid/v4';

let instances = {};
let timers = {};

const listeners = {
  _unnamed: [],
};

export const handleMessage = ({ listenTo, name, handler }) => {
  if (!listenTo) {
    listeners._unnamed.push(handler);

    return;
  }

  const id = name || uuid();

  _.set(listeners, [listenTo, id], handler);
};

export const removeListener = (listenTo, name) => {
  _.omit(listeners, [listenTo, name]);
};

export const run = (e, nameSpace) => {
  _.forEach(listeners[nameSpace], (listener, name) => {
    listener(e.data);
  });

  // Call unnamed handlers
  _.forEach(listeners._unnamed, (listener) => {
    listener && listener(e.data);
  });
};

export const getListeners = () => listeners;

export function create({
  nameSpace = 'global',
  url,
  onClose,
  onOpen,
  onError,
}) {
  const ws = new RWS(url, null, {
    minReconnectionDelay: 100,
  });

  listeners[nameSpace] = {};

  ws.onopen = (e) => {
    onOpen(e);

    if (timers[nameSpace]) {
      return;
    }

    // Keep websocket alive prevent close automatically
    timers[nameSpace] = setInterval(() => {
      ws.send('');
    }, 30 * 1000);
  };

  ws.onclose = onClose;
  ws.onerror = onError;
  ws.onmessage = (e) => {
    run(e, nameSpace);
  };

  instances[nameSpace] = ws;

  return ws;
}
