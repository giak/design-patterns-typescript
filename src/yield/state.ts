function* trafficLightStateMachine() {
  while (true) {
    yield "red";
    yield "green";
    yield "yellow";
  }
}

const trafficLight = trafficLightStateMachine();
console.log(trafficLight.next().value); // 'red'
console.log(trafficLight.next().value); // 'green'
console.log(trafficLight.next().value); // 'yellow'
console.log(trafficLight.next().value); // 'red'
