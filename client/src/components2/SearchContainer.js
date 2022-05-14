import { FormRow, FormRowSelect } from '.';
import Wrapper from '../assets/wrappers/SearchContainer';
import { useSelector, useDispatch } from 'react-redux';
import { handleChangeAllBatteryCells, clearFilters } from '../features/allBatteryCells/allBatteryCellsSlice';

const SearchContainer = () => {
  const { isLoading, search, searchCathode, searchAnode, searchType, searchSource } = useSelector(
    (store) => store.allBatteryCells
  );

  const { cathodeOptions, anodeOptions, typeOptions, sourceOptions } = useSelector((store) => store.batteryCell);

  const dispatch = useDispatch();

  const handleSearch = (e) => {
    if (isLoading) return;
    dispatch(handleChangeAllBatteryCells({ name: e.target.name, value: e.target.value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearFilters());
  };

  return (
    <Wrapper>
      <form className="form">
        <h4>search form</h4>
        <div className="form-center">
          {/* search for cell id */}
          <FormRow labelText="Search Cell ID" type="text" name="search" value={search} handleChange={handleSearch} />
          {/* search by cathode */}
          <FormRowSelect
            labelText="cathode"
            name="searchCathode"
            value={searchCathode}
            handleChange={handleSearch}
            list={['all', ...cathodeOptions]}
          />

          {/* search by anode*/}
          <FormRowSelect
            labelText="anode"
            name="searchAnode"
            value={searchAnode}
            handleChange={handleSearch}
            list={['all', ...anodeOptions]}
          />
          {/* search by type*/}
          <FormRowSelect
            labelText="type"
            name="searchType"
            value={searchType}
            handleChange={handleSearch}
            list={['all', ...typeOptions]}
          />
          {/* search by source*/}
          <FormRowSelect
            labelText="source"
            name="searchSource"
            value={searchSource}
            handleChange={handleSearch}
            list={['all', ...sourceOptions]}
          />
          <button className="btn btn-block btn-danger" disabled={isLoading} onClick={handleSubmit}>
            clear filters
          </button>
        </div>
      </form>
    </Wrapper>
  );
};
export default SearchContainer;
