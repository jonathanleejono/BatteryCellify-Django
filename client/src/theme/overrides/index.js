import Autocomplete from 'theme/overrides/Autocomplete';
import Backdrop from 'theme/overrides/Backdrop';
import Button from 'theme/overrides/Button';
import Card from 'theme/overrides/Card';
import CssBaseline from 'theme/overrides/CssBaseline';
import Input from 'theme/overrides/Input';
import Paper from 'theme/overrides/Paper';
import Tooltip from 'theme/overrides/Tooltip';
import Typography from 'theme/overrides/Typography';

export default function ComponentsOverrides(theme) {
  return Object.assign(
    Card(theme),
    Input(theme),
    Paper(theme),
    Button(theme),
    Tooltip(theme),
    Backdrop(theme),
    Typography(theme),
    CssBaseline(theme),
    Autocomplete(theme)
  );
}
