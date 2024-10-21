export default function generateEmployeeId(prefix: string = "EMP"): string {
  const randomNumber = Math.floor(1000 + Math.random() * 9000).toString();
  const timestamp = Date.now();
  const employeeId = `${prefix}-${randomNumber}-${timestamp}`;
  return employeeId;
}
