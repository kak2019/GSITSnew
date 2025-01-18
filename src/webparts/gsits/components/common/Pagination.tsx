/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from "react";
import { Stack, Label, IconButton } from "@fluentui/react";
import theme from "../../../../config/theme";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageClick: (page: number) => void;
}
export const Pagination = ({ currentPage, totalPages, onPageClick }: Props) => {
  return (
    <Stack
      horizontal
      horizontalAlign="space-between"
      verticalAlign="center"
      tokens={{ childrenGap: 10 }}
      styles={{
        root: {
          ...theme.paginated.paginatedbackground,
        },
      }}
    >
      <IconButton
        iconProps={{ iconName: "DoubleChevronLeft" }}
        title="First Page"
        ariaLabel="First Page"
        disabled={currentPage === 1}
        onClick={() => onPageClick(1)}
        styles={{
          root: {
            ...theme.paginated.paginatedicon.root,
          },
          icon: {
            ...theme.paginated.paginatedicon.icon,
          },
          rootHovered: {
            ...theme.paginated.paginatedicon.rootHovered,
          },
          rootDisabled: {
            ...theme.paginated.paginatedicon.rootDisabled,
          },
        }}
      />
      <IconButton
        iconProps={{ iconName: "ChevronLeft" }}
        title="Previous Page"
        ariaLabel="Previous Page"
        disabled={currentPage === 1}
        onClick={() => onPageClick(currentPage - 1)}
        styles={{
          root: {
            ...theme.paginated.paginatedicon.root,
          },
          icon: {
            ...theme.paginated.paginatedicon.icon,
          },
          rootHovered: {
            ...theme.paginated.paginatedicon.rootHovered,
          },
          rootDisabled: {
            ...theme.paginated.paginatedicon.rootDisabled,
          },
        }}
      />
      <Label styles={{ root: { alignSelf: "center" } }}>
        Page {currentPage} of {totalPages}
      </Label>
      <IconButton
        iconProps={{ iconName: "ChevronRight" }}
        title="Next Page"
        ariaLabel="Next Page"
        disabled={currentPage === totalPages}
        onClick={() => onPageClick(currentPage + 1)}
        styles={{
          root: {
            ...theme.paginated.paginatedicon.root,
          },
          icon: {
            ...theme.paginated.paginatedicon.icon,
          },
          rootHovered: {
            ...theme.paginated.paginatedicon.rootHovered,
          },
          rootDisabled: {
            ...theme.paginated.paginatedicon.rootDisabled,
          },
        }}
      />
      <IconButton
        iconProps={{ iconName: "DoubleChevronRight" }}
        title="Last Page"
        ariaLabel="Last Page"
        disabled={currentPage === totalPages}
        onClick={() => onPageClick(totalPages)}
        styles={{
          root: {
            ...theme.paginated.paginatedicon.root,
          },
          icon: {
            ...theme.paginated.paginatedicon.icon,
          },
          rootHovered: {
            ...theme.paginated.paginatedicon.rootHovered,
          },
          rootDisabled: {
            ...theme.paginated.paginatedicon.rootDisabled,
          },
        }}
      />
    </Stack>
  );
};
