import * as React from 'react';
import { Stack, IconButton, Label } from '@fluentui/react';
import theme from '../../../../config/theme';
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type
const Pagination = ({ totalItems, pageSize, currentPage, onPageChange }: any) => {
    const totalPages = Math.max(1,Math.ceil(totalItems / pageSize));

    const goToPage = (pageNumber: number):void => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            onPageChange(pageNumber);
        }
    };

    return (
        <Stack
            horizontal
            horizontalAlign="end"
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
                onClick={() => goToPage(1)}
                styles={{
                    root: {
                        ...theme.paginated.paginatedicon.root
                    },
                    icon: {
                        ...theme.paginated.paginatedicon.icon

                    },
                    rootHovered: {
                        ...theme.paginated.paginatedicon.rootHovered
                    },
                    rootDisabled: {
                        ...theme.paginated.paginatedicon.rootDisabled
                    },
                }}
            />
            <IconButton
                iconProps={{ iconName: "ChevronLeft" }}
                title="Previous Page"
                ariaLabel="Previous Page"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
                styles={{
                    root: {
                        ...theme.paginated.paginatedicon.root
                    },
                    icon: {
                        ...theme.paginated.paginatedicon.icon

                    },
                    rootHovered: {
                        ...theme.paginated.paginatedicon.rootHovered
                    },
                    rootDisabled: {
                        ...theme.paginated.paginatedicon.rootDisabled
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
                onClick={() => goToPage(currentPage + 1)}
                styles={{
                    root: {
                        ...theme.paginated.paginatedicon.root
                    },
                    icon: {
                        ...theme.paginated.paginatedicon.icon

                    },
                    rootHovered: {
                        ...theme.paginated.paginatedicon.rootHovered
                    },
                    rootDisabled: {
                        ...theme.paginated.paginatedicon.rootDisabled
                    },
                }}
            />
            <IconButton
                iconProps={{ iconName: "DoubleChevronRight" }}
                title="Last Page"
                ariaLabel="Last Page"
                disabled={currentPage === totalPages}
                onClick={() => goToPage(totalPages)}
                styles={{
                    root: {
                        ...theme.paginated.paginatedicon.root
                    },
                    icon: {
                        ...theme.paginated.paginatedicon.icon

                    },
                    rootHovered: {
                        ...theme.paginated.paginatedicon.rootHovered
                    },
                    rootDisabled: {
                        ...theme.paginated.paginatedicon.rootDisabled
                    },
                }}
            />
        </Stack>
    );
};

export default Pagination