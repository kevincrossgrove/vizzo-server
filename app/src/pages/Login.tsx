export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="p-4 border-accent border rounded-md bg-overlay-light">
        <h1 className="text-3xl font-bold tracking-wider mb-4">Log in</h1>
        <input
          className="mb-4 p-2 rounded w-80 text-black"
          placeholder="Email"
        />
        <br />
        <input
          className="mb-4 p-2 rounded w-80 text-black"
          placeholder="Password"
        />
        <br />
        <button className="bg-accent px-8 py-2 rounded-md font-bold">
          Log in
        </button>
      </div>
    </div>
  );
}
