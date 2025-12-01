import AuthStatus from "./AuthStatus.jsx";

export default function Header({ onNavigate, goHome }) {
  return (
    <header style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
      <div>
        <button onClick={goHome} style={{ marginRight: "1rem" }}>
          Tasty
        </button>
        <button onClick={() => onNavigate("home")} style={{ marginRight: "0.5rem" }}>
          Home
        </button>
        <button onClick={() => onNavigate("add")}>
          Add Recipe
        </button>
      </div>
      <AuthStatus />
    </header>
  );
}