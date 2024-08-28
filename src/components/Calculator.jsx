import { useState } from "react";

const Calculator = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isResultUsed, setIsResultUsed] = useState(false);
  const [openParenthesisCount, setOpenParenthesisCount] = useState(0);

  const operators = ["/", "*", "-", "+", "^", "log", "(", ")"];

  const handleClick = (value) => {
    if (isResultUsed && !operators.includes(value)) {
      setInput(value);
      setIsResultUsed(false);
    } else {
      if (value === "log") {
        setInput((prev) => prev + "log(");
      } else if (value === "(") {
        if (/\d$/.test(input)) {
          setInput((prev) => prev + "*" + value);
        } else {
          setInput((prev) => prev + value);
        }
        setOpenParenthesisCount((prevCount) => prevCount + 1);
      } else if (value === ")") {
        if (openParenthesisCount === 0) return;
        setOpenParenthesisCount((prevCount) => prevCount - 1);
        setInput((prev) => prev + value);
      } else {
        if (value === "(" && input.slice(-1) === "(") return;
        if (
          value === ")" &&
          (input === "" || operators.includes(input.slice(-1)))
        )
          return;
        if (value === "log" && input.slice(-3) === "log") return;

        if (
          operators.includes(value) &&
          input === "" &&
          value !== "(" &&
          value !== "log" &&
          value !== "-"
        )
          return;

        if (
          operators.includes(value) &&
          operators.includes(input.slice(-1)) &&
          value !== "(" &&
          value !== ")"
        ) {
          setInput((prev) => prev.slice(0, -1) + value);
        } else {
          setInput((prev) => prev + value);
        }
      }

      setIsResultUsed(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setResult("");
    setOpenParenthesisCount(0);
  };

  const handleDelete = () => {
    const lastChar = input.slice(-1);
    if (lastChar === "(") {
      setOpenParenthesisCount((prevCount) => prevCount - 1);
    } else if (lastChar === ")") {
      setOpenParenthesisCount((prevCount) => prevCount + 1);
    }

    if (input.length === 1) {
      setResult("");
    }
    setInput((prev) => prev.slice(0, -1));
  };

  const handleEqual = () => {
    try {
      let expression = input;

      if (operators.includes(expression.slice(-1))) {
        expression = expression.slice(0, -1);
      }

      expression = expression
        .replace(/\^/g, "**")
        .replace(/log\(/g, "Math.log10(");

      let openParentheses = (expression.match(/\(/g) || []).length;
      let closeParentheses = (expression.match(/\)/g) || []).length;
      if (openParentheses > closeParentheses) {
        expression += ")".repeat(openParentheses - closeParentheses);
      }

      const evalResult = eval(expression);
      const roundedResult = parseFloat(evalResult.toFixed(10));

      setResult(roundedResult);
      setInput(roundedResult.toString());
      setIsResultUsed(true);
    } catch (error) {
      setResult("Error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-lg shadow-2xl">
      <div className="text-white text-4xl mb-6 text-right">
        {input || result || "0"}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {["(", ")", "log", "/"].map((item) => (
          <button
            key={item}
            onClick={() => handleClick(item)}
            className="p-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition ease-in-out duration-200"
          >
            {item}
          </button>
        ))}
        {["7", "8", "9", "*"].map((item) => (
          <button
            key={item}
            onClick={() => handleClick(item)}
            className="p-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition ease-in-out duration-200"
          >
            {item}
          </button>
        ))}
        {["4", "5", "6", "-"].map((item) => (
          <button
            key={item}
            onClick={() => handleClick(item)}
            className="p-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition ease-in-out duration-200"
          >
            {item}
          </button>
        ))}
        {["1", "2", "3", "+"].map((item) => (
          <button
            key={item}
            onClick={() => handleClick(item)}
            className="p-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition ease-in-out duration-200"
          >
            {item}
          </button>
        ))}
        {["0", ".", "^", "="].map((item) => (
          <button
            key={item}
            onClick={() => (item === "=" ? handleEqual() : handleClick(item))}
            className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition ease-in-out duration-200"
          >
            {item}
          </button>
        ))}
        <button
          onClick={handleClear}
          className="col-span-2 p-4 bg-red-600 text-white rounded-lg hover:bg-red-500 transition ease-in-out duration-200"
        >
          Clear
        </button>
        <button
          onClick={handleDelete}
          className="col-span-2 p-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 transition ease-in-out duration-200"
        >
          Del
        </button>
      </div>
    </div>
  );
};

export default Calculator;
