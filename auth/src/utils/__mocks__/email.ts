const sendEmail = jest.fn().mockImplementation(async (emailOptions) => {
  return;
})

export {
  sendEmail
}