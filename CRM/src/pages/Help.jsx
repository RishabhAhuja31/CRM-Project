import './Help.css';

function Help() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">Help Page</h2>
      <p className="mb-4">
        Need assistance? You can find documentation here.
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <a
            href="https://docs.google.com/document/d/1nXSksKxeYx1nqwaLNMuLUMQ2hVjhCgsU0096oKrbYnQ/edit?tab=t.0"
            target="_blank"
            rel="noopener noreferrer"
            className="help-link"
          >
            📄 Google Docs Documentation
          </a>
        </li>
        <li>
          <a
            href="https://github.com/RishabhAhuja31/CRM-Project"
            target="_blank"
            rel="noopener noreferrer"
            className="help-link"
          >
            💻 GitHub Repository
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Help;
