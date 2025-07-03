export function getCareerRange(filter) {
  switch (filter) {
    case "신입":
      return { careerMin: 0, careerMax: 0 };
    case "1-3":
      return { careerMin: 1, careerMax: 36 };
    case "4-6":
      return { careerMin: 37, careerMax: 72 };
    case "7-9":
      return { careerMin: 73, careerMax: 108 };
    case "10-15":
      return { careerMin: 109, careerMax: 180 };
    case "16-20":
      return { careerMin: 181, careerMax: 240 };
    case "21+":
      return { careerMin: 241, careerMax: 1000 };
    default:
      return { careerMin: null, careerMax: null };
  }
}
