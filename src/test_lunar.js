import { Solar } from 'lunar-typescript';
const solar = Solar.fromYmdHms(1934, 4, 3, 23, 30, 0);
const ec = solar.getLunar().getEightChar();
console.log("Default Sect:", ec.getSect());
console.log("Day:", ec.getDay());
console.log("Time:", ec.getTime());

ec.setSect(1); // Sect 1
console.log("\nSect 1 Day:", ec.getDay());
console.log("Sect 1 Time:", ec.getTime());

ec.setSect(2); // Sect 2
console.log("\nSect 2 Day:", ec.getDay());
console.log("Sect 2 Time:", ec.getTime());
