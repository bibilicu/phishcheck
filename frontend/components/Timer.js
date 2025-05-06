import { View, Text, StyleSheet } from "react-native";
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

const Timer = forwardRef((props, ref) => {
  const [countdown, setCountdown] = useState(600); // 10 minutes
  const start_timestamp = useRef(null);
  const timer_interval = useRef(null);

  useImperativeHandle(ref, () => ({
    timer_start,
    timer_stop,
    get_timer_left,
  }));

  useEffect(() => {
    if (props.autoStart) {
      timer_start();
    }
    return () => timer_stop();
  }, []);

  const tick = () => {
    const elapsed_timer = Math.floor(
      (Date.now() - start_timestamp.current) / 1000
    );
    const remaining = 600 - elapsed_timer;
    if (remaining <= 0) {
      timer_stop();
      setCountdown(0);
      props.onExpire?.();
    } else {
      setCountdown(remaining);
    }
  };

  const timer_start = () => {
    if (timer_interval.current) return;
    start_timestamp.current = Date.now();
    tick();
    timer_interval.current = setInterval(tick, 1000);
  };

  const timer_stop = () => {
    clearInterval(timer_interval.current);
    timer_interval.current = null;
  };

  const get_timer_left = () => countdown;

  const timer_format = () => {
    const minutes = Math.floor(countdown / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (countdown % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <View>
      <Text style={styles.timer}>{timer_format()}</Text>
    </View>
  );
});

export default Timer;

const styles = StyleSheet.create({
  timer: {
    fontSize: 15,
    fontWeight: "bold",
    backgroundColor: "#FFF",
    width: "18%",
    padding: 7,
    top: -3,
    borderWidth: 2,
    borderColor: "#0F184C",
  },
});
