import React, { Component } from "react";
import {
  Header,
  Grid,
  Segment,
  Button,
  Modal,
  Item,
  Menu,
  Container,
  Icon,
} from "semantic-ui-react";
import {
  ReactSearchKit,
  SearchBar,
  ResultsLoader,
  EmptyResults,
  Error,
  InvenioSearchApi,
  ResultsList,
  Pagination,
} from "react-searchkit";
import { OverridableContext } from "react-overridable";
import { Formik } from "formik";
import { CommunityListItem } from "./CommunityListItem";
import PropTypes from "prop-types";

const overriddenComponents = {
  "communities.ResultsList.item": CommunityListItem,
};

export class CommunitySelectionModal extends Component {
  constructor(props) {
    super(props);

    this.apiEndpoints = {
      allCommunities: "https://127.0.0.1:5000/api/communities",
      myCommunities: "https://127.0.0.1:5000/api/user/communities",
    };

    const defaultEndpoint = this.apiEndpoints.allCommunities;

    this.state = {
      modalOpen: false,
      selectedEndpoint: defaultEndpoint,
    };
  }

  render() {
    const { modalOpen, selectedEndpoint } = this.state;
    const { allCommunities, myCommunities } = this.apiEndpoints;
    const { chosenCommunity } = this.props;

    const searchApi = new InvenioSearchApi({
      axios: { url: selectedEndpoint },
    });

    const searchbarPlaceholder =
      selectedEndpoint === allCommunities
        ? "Search in all communities"
        : "Search in my communities";

    return (
      <Formik initialValues={{ chosenCommunity }}>
        {({ values, resetForm }) => {
          return (
            <Modal
              className="community-selection-modal"
              closeOnDimmerClick={false}
              open={modalOpen}
              onClose={() => this.setState({ modalOpen: false })}
              onOpen={() => this.setState({ modalOpen: true })}
              trigger={<Button content="Select community" />}
            >
              <Modal.Header>
                <Grid padded={false}>
                  <Grid.Row verticalAlign="middle">
                    <Grid.Column floated="left" width={16}>
                      <Header as="h2">Select a community</Header>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Modal.Header>
              <Modal.Content>
                <OverridableContext.Provider value={overriddenComponents}>
                  <ReactSearchKit
                    appName="communities"
                    urlHandlerApi={{ enabled: false }}
                    searchApi={searchApi}
                    key={selectedEndpoint}
                    initialQueryState={{ size: 15, page: 1 }}
                  >
                    <Grid>
                      <Grid.Row>
                        <Grid.Column width={16}>
                          <Header as="h5">Currently selected</Header>

                          <Segment
                            placeholder={!values.chosenCommunity}
                            className="community-list-result-item-placeholder"
                            textAlign={
                              values.chosenCommunity ? undefined : "center"
                            }
                          >
                            {values.chosenCommunity ? (
                              <Item.Group>
                                <CommunityListItem
                                  result={values.chosenCommunity}
                                  standAlone
                                />
                              </Item.Group>
                            ) : (
                              <Header icon>
                                <Icon name="users" />
                                No community selected
                              </Header>
                            )}
                          </Segment>
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row verticalAlign="middle">
                        <Grid.Column width={8} textAlign="left" floated="left">
                          <Menu compact>
                            <Menu.Item
                              name="All"
                              active={selectedEndpoint === allCommunities}
                              onClick={() =>
                                this.setState({
                                  selectedEndpoint: allCommunities,
                                })
                              }
                            >
                              All
                            </Menu.Item>
                            <Menu.Item
                              name="My communities"
                              active={selectedEndpoint === myCommunities}
                              onClick={() =>
                                this.setState({
                                  selectedEndpoint: myCommunities,
                                })
                              }
                            >
                              My communities
                            </Menu.Item>
                          </Menu>
                        </Grid.Column>
                        <Grid.Column
                          width={8}
                          floated="right"
                          verticalAlign="middle"
                        >
                          <SearchBar
                            placeholder={searchbarPlaceholder}
                            autofocus
                            actionProps={{
                              icon: "search",
                              content: null,
                              className: "search",
                            }}
                          />
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row verticalAlign="middle">
                        <Grid.Column>
                          <ResultsLoader>
                            <Segment>
                              <Modal.Content
                                scrolling
                                className="community-list-results"
                              >
                                <EmptyResults />
                                <Error />
                                <ResultsList />
                              </Modal.Content>
                            </Segment>
                            <Container textAlign="center">
                              <Pagination />
                            </Container>
                          </ResultsLoader>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </ReactSearchKit>
                </OverridableContext.Provider>
                <Container className="community-selection-footer">
                  <Segment textAlign="center">
                    <p>
                      Didn’t find a community that fits you? Upload without a
                      community or{" "}
                      <a href="/communities/new" target="_blank">
                        create your own.
                      </a>{" "}
                    </p>
                  </Segment>
                </Container>
              </Modal.Content>

              <Modal.Actions>
                <Button
                  name="close"
                  onClick={() => {
                    this.setState({ modalOpen: false }, () => resetForm());
                  }}
                  icon="remove"
                  content="Close"
                />
                <Button
                  name="submit"
                  onClick={(event, formik) => console.log({ event, formik })}
                  primary
                  icon="checkmark"
                  content="save"
                />
              </Modal.Actions>
            </Modal>
          );
        }}
      </Formik>
    );
  }
}

CommunitySelectionModal.propTypes = {
  chosenCommunity: PropTypes.object,
};

CommunitySelectionModal.defaultProps = {
  chosenCommunity: null,
};
