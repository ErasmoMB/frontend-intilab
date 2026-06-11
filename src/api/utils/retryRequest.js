const retryRequest = async (apiCall, retries = 3, initialDelay = 1000) => {
  let currentDelay = initialDelay;

  for (let i = 0; i < retries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === retries - 1) throw error;

      const delay = currentDelay;
      await new Promise((resolve) => setTimeout(resolve, delay));
      currentDelay *= 2;
    }
  }
};

export default retryRequest;

