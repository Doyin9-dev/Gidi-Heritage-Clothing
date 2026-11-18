const paths = {
  arrow: <path d="M3.5 12h16m-6-5.5L19 12l-5.5 5.5" />,
  left: <path d="M20.5 12h-16m6 5.5L5 12l5.5-5.5" />,
  up: <path d="M12 20V4m-5.5 6L12 4.5l5.5 5.5" />,
  search: <><circle cx="10.8" cy="10.8" r="6" /><path d="m15.2 15.2 4.3 4.3" /></>,
  bag: <><path d="M5.2 7.8h13.6l1 12.9H4.2l1-12.9Z" /><path d="M8.5 10V6a3.5 3.5 0 0 1 7 0v4" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  menu: <path d="M3.5 8h17m-17 8h17" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  check: <path d="m5 12 4.5 4.5L19 7" />,
};

export function Icon({ name, className }) {
  return (
    <svg aria-hidden="true" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}
