export const defaultSettings = {
  insert: "top",
  container: "top-right",
  animationIn: ["animated", "flipInX"],
  animationOut: ["animated", "flipOutX"],
  dismiss: {
    duration: 5000,
    onScreen: false,
    pauseOnHover: true,
    waitForAnimation: true
  }
};

export const type = {
  success: 'success',
  error: 'danger',
  info: 'info',
  default: 'default',
  warning: 'warning'
};

export const durationBasedOnType = {
  success: 3000,
  error: 8000,
  info: 6000,
  default: 5000,
  warning: 7000
};