import React from 'react';
import PropTypes from 'prop-types';
import {
  PersonResult,
  ResultItemGroup,
  QuickSearch,
} from '@atlaskit/quick-search';
import AppContext from '../../AppContext';
import debounce from 'lodash.debounce';
import { searchUsers } from '../../api';

class UserSearch extends React.Component {
  static contextType = AppContext;

  state = {
    query: '',
    loading: false,
    results: null,
  };

  constructor(props) {
    super(props);
    this.search = debounce(this._search, 250);
  }

  _search = async (q) => {
    try {
      const results = await searchUsers({
        ...this.context.data,
        query: q,
        maxResults: this.props.maxResults || 10,
      });
      this.setState({ results });
    } catch (e) {
      if (e.message === 'SESSION_EXPIRED') {
        this.context.update({ ...this.context.data, session: 'EXPIRED' });
        return;
      }
      throw e;
    } finally {
      this.setState({ loading: false });
    }
  };

  onSearchInput = (e) => {
    if (!e.target.value.trim()) {
      this.setState({ query: e.target.value, loading: false });
      return;
    }
    this.setState({
      query: e.target.value,
      loading: true,
    });
    this.search(e.target.value.trim());
  };

  render() {
    return (
      <QuickSearch
        placeholder="Search for other JIRA users"
        value={this.state.query}
        onSearchInput={this.onSearchInput}
        isLoading={this.state.loading}
      >
        {this.state.results && (
          <ResultItemGroup>
            {this.state.results.map((result) => (
              <PersonResult
                key={result.key}
                avatarUrl={result.avatarUrls['16x16']}
                name={result.displayName}
                onClick={() =>
                  this.props.onResultClick && this.props.onResultClick(result)
                }
              />
            ))}
          </ResultItemGroup>
        )}
      </QuickSearch>
    );
  }
}

UserSearch.propTypes = {
  onResultClick: PropTypes.func,
};

export default UserSearch;
