import { Switch, Route } from "wouter";
import Landing from "@/pages/Landing";
import Reading from "@/pages/Reading";
import Book from "@/pages/Book";
import Guide from "@/pages/Guide";
import MonTirage from "@/pages/MonTirage";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/reading" component={Reading} />
      <Route path="/book" component={Book} />
      <Route path="/guide" component={Guide} />
      <Route path="/mon-tirage" component={MonTirage} />
    </Switch>
  );
}
